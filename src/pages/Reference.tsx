import { useState } from 'react';
import { funeralHomes, cities } from '@/data/funeralHomes';
import { funeralCustoms, regions } from '@/data/customs';
import { guides } from '@/data/guides';
import {
  Building2,
  MapPin,
  Phone,
  Star,
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  ListChecks,
  MapPinned,
  FileText,
  Lightbulb,
} from 'lucide-react';

type TabType = 'funeral-homes' | 'customs' | 'guides';

export const Reference = () => {
  const [activeTab, setActiveTab] = useState<TabType>('funeral-homes');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCustom, setExpandedCustom] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  const filteredHomes = funeralHomes.filter((home) => {
    if (selectedCity !== 'all' && home.city !== selectedCity) return false;
    if (searchQuery && !home.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredCustoms = funeralCustoms.filter((custom) => {
    if (selectedRegion !== 'all' && custom.region !== selectedRegion) return false;
    if (searchQuery && !custom.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredGuides = guides.filter((guide) => {
    if (searchQuery && !guide.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { id: 'funeral-homes' as TabType, label: '殡仪馆', icon: Building2 },
    { id: 'customs' as TabType, label: '丧葬习俗', icon: BookOpen },
    { id: 'guides' as TabType, label: '办事指南', icon: FileText },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-700 text-white shadow-lg shadow-primary-200'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {activeTab === 'funeral-homes' && (
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="input-field w-auto min-w-[150px]"
            >
              <option value="all">全部城市</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          )}

          {activeTab === 'customs' && (
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input-field w-auto min-w-[150px]"
            >
              <option value="all">全部地区</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {activeTab === 'funeral-homes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHomes.map((home, index) => (
            <div
              key={home.id}
              className="card hover:shadow-lg transition-all animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{home.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gold-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{home.rating}</span>
                    </div>
                  </div>
                </div>
                <span className="badge bg-primary-100 text-primary-700">{home.city}</span>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>{home.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href={`tel:${home.phone}`} className="text-primary-600 hover:underline">
                    {home.phone}
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-2">服务项目：</p>
                <div className="flex flex-wrap gap-1.5">
                  {home.services.map((service) => (
                    <span
                      key={service}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'customs' && (
        <div className="space-y-4">
          {filteredCustoms.map((custom, index) => (
            <div
              key={custom.id}
              className="card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => setExpandedCustom(expandedCustom === custom.id ? null : custom.id)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-800 font-serif">{custom.title}</h4>
                        <span className="badge bg-primary-100 text-primary-700">{custom.region}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{custom.content}</p>
                    </div>
                  </div>
                  {expandedCustom === custom.id ? (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </div>
              </button>

              {expandedCustom === custom.id && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
                  <h5 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-primary-600" />
                    传统流程
                  </h5>
                  <ol className="space-y-2">
                    {custom.procedures.map((procedure, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span>{procedure}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'guides' && (
        <div className="space-y-4">
          {filteredGuides.map((guide, index) => (
            <div
              key={guide.id}
              className="card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-800 font-serif">{guide.title}</h4>
                        <span className="badge bg-green-100 text-green-700">{guide.category}</span>
                      </div>
                    </div>
                  </div>
                  {expandedGuide === guide.id ? (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </div>
              </button>

              {expandedGuide === guide.id && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
                  <div>
                    <h5 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-primary-600" />
                      所需材料
                    </h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {guide.materials.map((material, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
                          {material}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <MapPinned className="w-4 h-4 text-primary-600" />
                      办理地点
                    </h5>
                    <p className="text-sm text-slate-600">{guide.location}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-primary-600" />
                      办理流程
                    </h5>
                    <ol className="space-y-2">
                      {guide.process.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                          <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {guide.tips && (
                    <div className="p-4 bg-gold-50 rounded-xl border border-gold-200">
                      <h5 className="font-medium text-gold-800 mb-1 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        温馨提示
                      </h5>
                      <p className="text-sm text-gold-700">{guide.tips}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
